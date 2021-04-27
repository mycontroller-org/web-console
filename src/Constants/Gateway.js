// Provider keeps supported providers list, this value will be used in backend
export const Provider = {
  MySensorsV2: "mysensors_v2",
  Tasmota: "tasmota",
  SystemMonitoring: "system_monitoring",
}

// Providers options list
export const ProviderOptions = [
  { value: Provider.MySensorsV2, label: "MySensors v2", description: "MySensors.org Version 2.x" },
  { value: Provider.Tasmota, label: "Tasmota", description: "tasmota.github.io" },
  {
    value: Provider.SystemMonitoring,
    label: "System Monitoring",
    description: "Capture system resources and reports",
  },
]

// Protocol values
export const Protocol = {
  MQTT: "mqtt",
  Serial: "serial",
  Ethernet: "ethernet",
  Internal: "internal",
}

// Protocol options list
export const ProtocolOptions = [
  { value: Protocol.MQTT, label: "MQTT", description: "MQTT Protocol" },
  { value: Protocol.Serial, label: "Serial", description: "Serial Protocol" },
  { value: Protocol.Ethernet, label: "Ethernet", description: "Ethernet Protocol" },
  { value: Protocol.Internal, label: "Internal", description: "Internal Protocol" },
]

export const filterProtocolOptions = (providerType) => {
  const protocols = []
  switch (providerType) {
    case Provider.MySensorsV2:
      protocols.push(Protocol.MQTT, Protocol.Serial, Protocol.Ethernet)
      break

    case Provider.Tasmota:
      protocols.push(Protocol.MQTT)
      break

    case Provider.SystemMonitoring:
      protocols.push(Protocol.Internal)
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
