// This file maintains all the constants used across pages

// Provider keeps supported providers list, this value will be used in backend
export const Provider = {
  MySensorsV2: "mysensors_v2",
  Tasmota: "tasmota",
}

// Providers options list
export const ProviderOptions = [
  { value: Provider.MySensorsV2, label: "MySensors v2", description: "MySensors.org Version 2.x" },
  { value: Provider.Tasmota, label: "Tasmota", description: "tasmota.github.io" },
]

// Protocol values
export const Protocol = {
  MQTT: "mqtt",
  Serial: "serial",
}

// Protocol options list
export const ProtocolOptions = [
  { value: Protocol.MQTT, label: "MQTT", description: "MQTT Protocol" },
  { value: Protocol.Serial, label: "Serial", description: "Serial Protocol" },
]

export const filterProtocolOptions = (providerType) => {
  const protocols = []
  switch (providerType) {
    case Provider.MySensorsV2:
      protocols.push(Protocol.MQTT, Protocol.Serial)
      break

    case Provider.Tasmota:
      protocols.push(Protocol.MQTT)
      break

    default:
      break
  }
  const protocolOptions = []
  ProtocolOptions.forEach((option) => {
    if (protocols.includes(option.value)) {
      protocolOptions.push(option)
    }
  })

  return protocolOptions
}

// Message logger values
export const MessageLogger = {
  None: "none",
  FileLogger: "file_logger",
}

// Message logger options list
export const MessageLoggerOptions = [
  { value: MessageLogger.None, label: "None", description: "Messages will not be logged" },
  { value: MessageLogger.FileLogger, label: "File Logger", description: "Messages will be logged in a file" },
]

// Dampening values
export const Dampening = {
  None: "",
  Consecutive: "consecutive",
  LastNEvaluations: "last_n_evaluations",
  ActiveTime: "active_time",
}

// Dampening options
export const DampeningOptions = [
  { value: Dampening.None, label: "None", description: "disabled" },
  { value: Dampening.Consecutive, label: "Consecutive", description: "Consecutive" },
  { value: Dampening.LastNEvaluations, label: "Last N Evaluations", description: "Last N Evaluations" },
  { value: Dampening.ActiveTime, label: "Active Time", description: "Active Time" },
]

// Handler type values
export const HandlerType = {
  Noop: "noop",
  Email: "email",
}

// Handler type options
export const HandlerTypeOptions = [
  { value: HandlerType.Noop, label: "Noop", description: "No Operation Handler" },
  { value: HandlerType.Email, label: "Email", description: "Sends email" },
]

// Schedule type values
export const ScheduleType = {
  Repeat: "repeat",
  Cron: "cron",
  Simple: "simple",
  Sunrise: "sunrise",
  Sunset: "sunset",
  Moonrise: "moonrise",
  Moonset: "moonset",
}

// Schedule type options
export const ScheduleTypeOptions = [
  { value: ScheduleType.Repeat, label: "Repeat", description: "Repeat with an interval" },
  { value: ScheduleType.Cron, label: "Cron", description: "Cron Expression" },
  { value: ScheduleType.Simple, label: "Simple", description: "daily, weekly, monthly schedule" },
  { value: ScheduleType.Sunrise, label: "Sunrise", description: "On Sunrise time" },
  { value: ScheduleType.Sunset, label: "Sunset", description: "On Sunset time" },
  { value: ScheduleType.Moonrise, label: "Moonrise", description: "On Moonrise time" },
  { value: ScheduleType.Moonset, label: "Moonset", description: "On Moonset time" },
]

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
