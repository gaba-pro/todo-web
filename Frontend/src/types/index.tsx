export interface Todo {
  id: number;
  task: string;
  assign: string;
  deskripsi: string;
  dateline: string;
  status: boolean;
  confirmed?: boolean;
}
