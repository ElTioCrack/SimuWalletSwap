enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

class Task {
  id: string;
  status: TaskStatus;
}

const task = new Task();

