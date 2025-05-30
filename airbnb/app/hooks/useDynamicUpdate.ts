import { useEffect, useState } from "react";
import { eventService, EventTypes } from "../services/eventService";

interface UseDynamicUpdateOptions {
  eventType: EventTypes;
  initialData?: any;
  onUpdate?: (data: any) => void;
}

export function useDynamicUpdate<T>({
  eventType,
  initialData,
  onUpdate,
}: UseDynamicUpdateOptions) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUpdate = (updatedData: T) => {
      setIsLoading(true);
      try {
        setData(updatedData);
        onUpdate?.(updatedData);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to the event
    eventService.subscribe(eventType, handleUpdate);

    // Cleanup subscription on unmount
    return () => {
      eventService.unsubscribe(eventType, handleUpdate);
    };
  }, [eventType, onUpdate]);

  return {
    data,
    isLoading,
    setData,
  };
}
