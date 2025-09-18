import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

export default function ScheduleApp() {
  const [schedules, setSchedules] = useState([]);
  const [date, setDate] = useState('');
  const [task, setTask] = useState('');

  const addSchedule = () => {
    if (!date || !task) return;
    setSchedules([...schedules, { id: Date.now(), date, task }]);
    setDate('');
    setTask('');
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">📅 スケジュール管理アプリ</h1>

      <Card className="mb-6 p-4">
        <CardContent className="flex gap-2 flex-wrap">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="text"
            placeholder="予定を入力..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <Button onClick={addSchedule}>追加</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {schedules.length === 0 && <p>予定はまだありません。</p>}
        {schedules.map((s) => (
          <Card key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{s.date}</p>
              <p>{s.task}</p>
            </div>
            <Button variant="ghost" onClick={() => deleteSchedule(s.id)}>
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
