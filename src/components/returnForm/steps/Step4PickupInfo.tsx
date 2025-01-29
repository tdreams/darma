import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { FormData, TimeSlot, TIME_SLOTS } from "@/utils/returnFormContent";

interface Step4Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  calendarDate?: Date;
  setCalendarDate: (date: Date | undefined) => void;
}

export function Step4PickupInfo({
  errors,
  setValue,
  calendarDate,
  setCalendarDate,
}: Step4Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateSelect = (date: Date | undefined) => {
    setCalendarDate(date);
    if (date) {
      setValue("pickupDate", date);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pickup Info & Terms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Date */}
        <div>
          <Label>Preferred Pickup Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal mt-1 ${
                  !calendarDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {calendarDate ? format(calendarDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleDateSelect}
                initialFocus
                disabled={(date) => {
                  date.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                fromDate={today}
              />
            </PopoverContent>
          </Popover>
          {errors.pickupDate && (
            <p className="text-red-500 text-sm">{errors.pickupDate.message}</p>
          )}
        </div>

        {/* Time Slot */}
        <div>
          <Label htmlFor="timeSlot">Time Slot</Label>
          <Select
            onValueChange={(value: TimeSlot) => setValue("timeSlot", value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot === "morning"
                    ? "Morning (9AM - 12PM)"
                    : slot === "afternoon"
                    ? "Afternoon (12PM - 3PM)"
                    : "Evening (3PM - 6PM)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm">{errors.timeSlot.message}</p>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="mt-6">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            onCheckedChange={(checked) => {
              setValue("termsAccepted", checked === true);
            }}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            I agree to the <span className="underline">terms of service</span>{" "}
            and
            <span className="underline"> privacy policy</span>.
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mt-1">
            {errors.termsAccepted.message}
          </p>
        )}
      </div>
    </div>
  );
}
