import { Publisher, Subjects, OrderCreatedEvent } from '@vetal-tickets/common';

export class OrderCreatedPblisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
