import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export default function useReduceMotion() {
	const [reduceMotion, setReduceMotion] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;

		AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
			if (mounted) setReduceMotion(enabled);
		});

		// addEventListener API differs between RN versions; handle both
		const subscription =
			(AccessibilityInfo.addEventListener &&
				AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
					if (mounted) setReduceMotion(enabled);
				})) ||
			// fallback for older RN (returns subscription object with remove)
			AccessibilityInfo.addEventListener?.("reduceMotionChanged", (enabled) => {
				if (mounted) setReduceMotion(enabled);
			});

		return () => {
			mounted = false;
			if (subscription?.remove) subscription.remove();
		};
	}, []);

	return reduceMotion;
}