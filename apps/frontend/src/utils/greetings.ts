export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

export function getGreetingText(username: string): string {
  const timeOfDay = getTimeBasedGreeting();
  return `Good ${timeOfDay}, ${username}`;
}
