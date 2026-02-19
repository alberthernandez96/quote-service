import { Server } from 'http';
import cors from "cors";
import express, { Express } from 'express';
import {
  CommandBus,
  QueryBus,
  ValidationMiddleware,
} from '@albertoficial/backend-shared';
import {
  createQuoteSchema,
  updateQuoteSchema,
  getQuoteParamsSchema,
  QuoteRoutes,
} from '@albertoficial/api-contracts';
import {
  CreateQuoteCommand,
  CreateQuoteCommandHandler,
  UpdateQuoteCommand,
  UpdateQuoteCommandHandler,
  GetLastRegistryQuery,
  GetLastRegistryQueryHandler,
  GetQuoteQuery,
  GetQuoteQueryHandler,
  GetQuoteListQuery,
  GetQuoteListQueryHandler,
} from '@application';
import {
  QuoteCommandController,
  QuoteQueryController,
} from '@presentation';
import { QuoteRepositoryAdapter } from '@infrastructure';
import { observability } from './Observability';
import { Infrastructure } from './Infrastructure';


export class Application {
  private app: Express;
  private server?: Server;

  constructor(infrastructure: Infrastructure) {
    this.app = express();
    // Enable CORS for development
    if (process.env.NODE_ENV === "development") {
      this.app.use(cors());
    }
    this.app.use(express.json());
    
    // Add tracing middleware BEFORE routes
    this.app.use(observability.getTracingMiddleware());

    // Expose Prometheus metrics endpoint
    this.app.get('/metrics', observability.getMetrics());

    const commandBus = new CommandBus();
    const queryBus = new QueryBus();

    const repos = infrastructure.getRepositories();
    const quoteRepositoryAdapter = new QuoteRepositoryAdapter(repos.quote);

    commandBus.registerMany([
      { type: CreateQuoteCommand, handler: new CreateQuoteCommandHandler(quoteRepositoryAdapter) },
      { type: UpdateQuoteCommand, handler: new UpdateQuoteCommandHandler(quoteRepositoryAdapter) },
    ]);
    queryBus.registerMany([
      { type: GetQuoteQuery, handler: new GetQuoteQueryHandler(quoteRepositoryAdapter) },
      { type: GetLastRegistryQuery, handler: new GetLastRegistryQueryHandler(quoteRepositoryAdapter) },
      { type: GetQuoteListQuery, handler: new GetQuoteListQueryHandler(quoteRepositoryAdapter) },
    ]);

    const quoteCommandController = new QuoteCommandController(commandBus);
    const quoteQueryController = new QuoteQueryController(queryBus);

    // Quote routes
    this.app.post(
      QuoteRoutes.create,
      ValidationMiddleware.validateBody(createQuoteSchema),
      (req, res) => quoteCommandController.create(req, res)
    );
    this.app.get(QuoteRoutes.getLastRegistry, (req, res) => quoteQueryController.getLastRegistry(req, res));
    this.app.get(
      QuoteRoutes.get,
      ValidationMiddleware.validateParams(getQuoteParamsSchema),
      (req, res) => quoteQueryController.get(req, res)
    );
    this.app.get(QuoteRoutes.getAll, (req, res) => quoteQueryController.getAll(req, res));
    this.app.put(
      QuoteRoutes.update,
      ValidationMiddleware.validateParams(getQuoteParamsSchema),
      ValidationMiddleware.validateBody(updateQuoteSchema),
      (req, res) => quoteCommandController.update(req, res)
    );
  }

  async start(): Promise<void> {
    const PORT = process.env.PORT || 3004;
    const logger = observability.getRootLogger();
    
    this.server = this.app.listen(PORT, () => {
      logger.info({ port: PORT }, `Quote Service running on port ${PORT}`);
    });
  }

  async shutdown(): Promise<void> {
    if (this.server) {
      this.server.close();
    }
  }
}
