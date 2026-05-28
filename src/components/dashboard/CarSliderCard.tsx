import { useCarStore } from "@/stores/car-store";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Pencil, Landmark, Users, CalendarDays, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { carService } from "@/services/car-service";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function CarSliderCard() {
  const { car, setCar, bank, setBank, bankGroup, setBankGroup, period, setPeriod, metric, setMetric } =
    useCarStore();
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState(car.toString());

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-2 lg:gap-3">
      <Card className="col-span-2 sm:col-span-4 lg:col-span-1 p-2 lg:p-3 border-primary/30 bg-primary/5">
        <div className="text-[10px] lg:text-[11px] font-semibold text-muted-foreground mb-1 lg:mb-1.5">
          1. CHỌN MỨC CAR (%)
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-2">
          {editing ? (
            <Input
              autoFocus
              value={tempVal}
              onChange={(e) => setTempVal(e.target.value)}
              onBlur={() => {
                const n = parseFloat(tempVal);
                if (!isNaN(n)) setCar(Math.max(5, Math.min(20, n)));
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
              }}
              className="w-24 lg:w-28 text-xl lg:text-2xl font-bold h-8 lg:h-10 text-primary"
            />
          ) : (
            <button
              onClick={() => {
                setTempVal(car.toFixed(2));
                setEditing(true);
              }}
              className="text-2xl lg:text-3xl font-bold text-primary tabular-nums hover:opacity-80 flex items-center gap-1 lg:gap-1.5"
            >
              {car.toFixed(2)}%
              <Pencil className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <Slider
          value={[car]}
          min={5}
          max={20}
          step={0.01}
          onValueChange={(v) => setCar(v[0])}
        />
        <div className="flex justify-between text-[9px] lg:text-[10px] text-muted-foreground mt-1 lg:mt-1.5">
          <span>5%</span>
          <span>20%</span>
        </div>
      </Card>

      <SelectField
        label="Chọn chỉ tiêu"
        value={metric}
        onChange={setMetric}
        options={carService.getMetrics()}
        icon={<Target className="w-3 h-3 lg:w-3.5 lg:h-3.5" />}
      />
      <SelectField
        label="Ngân hàng"
        value={bank}
        onChange={setBank}
        options={carService.getBanks(bankGroup)}
        icon={<Landmark className="w-3 h-3 lg:w-3.5 lg:h-3.5" />}
      />
      <SelectField
        label="Nhóm ngân hàng"
        value={bankGroup}
        onChange={setBankGroup}
        options={carService.getBankGroups()}
        icon={<Users className="w-3 h-3 lg:w-3.5 lg:h-3.5" />}
      />
      <SelectField
        label="Giai đoạn dữ liệu"
        value={period}
        onChange={setPeriod}
        options={carService.getPeriods()}
        icon={<CalendarDays className="w-3 h-3 lg:w-3.5 lg:h-3.5" />}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-2 lg:p-3">
      <div className="text-[10px] lg:text-[11px] font-semibold text-muted-foreground mb-1 lg:mb-1.5 flex items-center gap-1 lg:gap-1.5">
        {icon} {label}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-7 lg:h-9 text-[11px] lg:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}
