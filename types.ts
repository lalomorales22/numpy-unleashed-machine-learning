
import React from 'react';

export interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface DataFlowStep {
  description: string;
  code: string;
  data: Record<string, any>[]; // Array of objects for the table
}
