import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChapterEventsService } from './chapter.events';
import { AnimeFavoriteEventsService } from './anime-favorite.events';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
  ],
  providers: [ChapterEventsService, AnimeFavoriteEventsService],
  exports: [ChapterEventsService, AnimeFavoriteEventsService],
})
export class EventsModule {}
