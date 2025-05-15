export interface Message {
    id: number;
    sender: string;
    recipient: string;
    content: string;
    timestamp: Date;
    status: 'sent' | 'read' | 'delivered';
  }
  