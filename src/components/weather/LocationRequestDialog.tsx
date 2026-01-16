import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin } from "lucide-react";

interface LocationRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export const LocationRequestDialog: React.FC<LocationRequestDialogProps> = ({
  open,
  onOpenChange,
  onAccept,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-black/40 backdrop-blur-xl border-white/10 text-white shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <MapPin className="text-blue-400 size-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              Enable Location
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-white/70 text-base leading-relaxed">
            To provide accurate local weather forecasts and hourly updates, we
            need to access your current location. This helps us sync with the
            nearest weather station.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/10 text-black/80 transition-all duration-300">
            Enter City Manually
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAccept}
            className="bg-blue-600 hover:bg-blue-500 text-black/80 border-none shadow-lg shadow-blue-500/20 transition-all duration-300"
          >
            Allow Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
