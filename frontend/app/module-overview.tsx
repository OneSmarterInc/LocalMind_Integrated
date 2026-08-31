import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

// The separate Module Overview page is intentionally skipped.
// Any old navigation to this route is redirected directly to Learning.
export default function ModuleOverviewPage() {
  const { moduleId } = useLocalSearchParams<{ moduleId?: string }>();

  useEffect(() => {
    if (moduleId) {
      router.replace({
        pathname: "/learning",
        params: { moduleId: String(moduleId) },
      });
    } else {
      router.replace("/modules");
    }
  }, [moduleId]);

  return null;
}
