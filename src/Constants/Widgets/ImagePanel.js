// image panel types
export const ImageSourceType = {
  ImageFromField: "image_from_field",
  URL: "url",
  Disk: "disk",
}

// image panel options
export const ImageSourceTypeOptions = [
  { value: ImageSourceType.ImageFromField, label: "Image From Field", description: "Image data from a field resource" },
  { value: ImageSourceType.URL, label: "URL", description: "Image from a url" },
  { value: ImageSourceType.Disk, label: "Disk", description: "Image from a disk location" },
]

// image rotation types
export const ImageRotationType = {
  Rotate_0: "0",
  RotateRight_90: "90",
  RotateLeft_90: "-90",
  Rotate_180: "180",
}

// image rotation options
export const ImageRotationTypeOptions = [
  { value: ImageRotationType.Rotate_0, label: "None", description: "No rotation" },
  { value: ImageRotationType.RotateRight_90, label: "Rotate Right 90°", description: "Rotate right side 90°" },
  { value: ImageRotationType.RotateLeft_90, label: "Rotate Left 90°", description: "Rotate left side 90°" },
  { value: ImageRotationType.Rotate_180, label: "Rotate 180°", description: "Rotate 180°" },
]
