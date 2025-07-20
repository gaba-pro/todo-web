import { Todo } from "../types";

interface Props {
  todo: Todo;
  role: string;
  username: string;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: boolean) => void;
}

export const TodoItem = ({
  todo,
  role,
  username,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) => {
  return (
    <div className="border p-4 rounded-lg flex items-center justify-between">
      <div>
        <div className="font-semibold text-black">{todo.task}</div>
        <div className="text-sm text-gray-600">Deskripsi: {todo.deskripsi}</div>
        <div className="text-sm text-gray-600">
          Deadline: {new Date(todo.dateline).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-600">Assign: {todo.assign}</div>
      </div>

      {/* Status & Action Button Here (disederhanakan) */}
    </div>
  );
};
