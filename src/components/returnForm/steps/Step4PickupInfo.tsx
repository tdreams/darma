import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

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
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  RocketIcon,
  ShieldCheckIcon,
} from "lucide-react";
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
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Schedule Your Pickup
        </h2>
        <p className="text-gray-500 mt-2">
          Choose a convenient time for collection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Picker Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Pickup Date</h3>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left h-12 ${
                  !calendarDate ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {calendarDate ? format(calendarDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleDateSelect}
                initialFocus
                disabled={(date) => date < today}
                fromDate={today}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          {errors.pickupDate && (
            <p className="text-red-500 text-sm mt-2">
              {errors.pickupDate.message}
            </p>
          )}
        </div>

        {/* Time Slot Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Time Slot</h3>
          </div>

          <Select
            onValueChange={(value: TimeSlot) => setValue("timeSlot", value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Choose time slot" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem
                  key={slot}
                  value={slot}
                  className="flex items-center gap-2"
                >
                  {slot === "morning" && "🌅 Morning (9AM - 12PM)"}
                  {slot === "afternoon" && "☀️ Afternoon (12PM - 3PM)"}
                  {slot === "evening" && "🌙 Evening (3PM - 6PM)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm mt-2">
              {errors.timeSlot.message}
            </p>
          )}
        </div>
      </div>

      {/* Express Pickup Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <RocketIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Express Pickup</h3>
            <p className="text-sm text-gray-500">
              Get priority service (+$3.00)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Priority Handling</p>
            <p className="text-sm text-gray-500">
              Guaranteed pickup within 2 hours
            </p>
          </div>
          <Switch
            onCheckedChange={(checked) => setValue("expressPickup", checked)}
            className="data-[state=checked]:bg-amber-600"
          />
        </div>
      </div>

      {/* Terms & Conditions Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
        </div>

        <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
          <Switch
            id="terms"
            onCheckedChange={(checked) =>
              setValue("termsAccepted", checked === true)
            }
            className="mt-1"
          />
          <label htmlFor="terms" className="flex-1">
            <p className="text-sm font-medium">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              By checking this box, you confirm acceptance of our service terms
            </p>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mt-2">
            {errors.termsAccepted.message}
          </p>
        )}
      </div>
    </div>
  );
}
