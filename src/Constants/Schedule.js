// Schedule Frequency values
export const ScheduleFrequency = {
  Daily: "daily",
  Weekly: "weekly",
  Monthly: "monthly",
}

// Schedule Frequency options
export const ScheduleFrequencyOptions = [
  { value: ScheduleFrequency.Daily, label: "Daily", description: "Runs every day" },
  { value: ScheduleFrequency.Weekly, label: "Weekly", description: "Runs weekly once" },
  { value: ScheduleFrequency.Monthly, label: "Monthly", description: "Runs monthly once" },
]

export const WeekDayOptions = [
  { value: "sun", label: "Sunday" },
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
]

// Schedule type values
export const ScheduleType = {
  Repeat: "repeat",
  Cron: "cron",
  Simple: "simple",
  Sunrise: "sunrise",
  Sunset: "sunset",
}

// Schedule type options
export const ScheduleTypeOptions = [
  { value: ScheduleType.Repeat, label: "Repeat", description: "Repeat with an interval" },
  { value: ScheduleType.Cron, label: "Cron", description: "Cron Expression" },
  { value: ScheduleType.Simple, label: "Simple", description: "daily, weekly, monthly schedule" },
  { value: ScheduleType.Sunrise, label: "Sunrise", description: "On Sunrise time" },
  { value: ScheduleType.Sunset, label: "Sunset", description: "On Sunset time" },
]
