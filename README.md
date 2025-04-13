# Life Sucks 🧠 - Productivity & Mood-Aware Task Tracker App

Life Sucks is a mood-aware productivity app built using **React Native**. It helps users stay productive, track their focus sessions, manage daily tasks with priorities and types, and receive mood-based suggestions. The app also includes a gamified rewards system and social comparison with friends.

---

## 🚀 Features

- ✅ Task Management with Priority & Type (Easy, Moderate, Difficult, Time-taking)
- 📈 Mood Tracking and Sentiment Analysis
- 🎯 Focus Mode with Pomodoro Timer (25 min focus + 5 min rest)
- 💬 Mood-Based Task Suggestions
- 🧠 Animated UI and Interactive Modals
- 🏆 Reward System with Points and Unlockables
- 👫 Friends Progress Comparison
- 📱 Local Data Persistence using AsyncStorage
- 📉 Social Media Usage Tracking and Limit Alert

---

## 📦 Libraries & Dependencies Used

| Library | Purpose |
|--------|---------|
| **react** | Core React library |
| **react-native** | Core framework for building native apps |
| **@react-navigation/native** | Navigation container for screen management |
| **@react-navigation/stack** | Stack navigator for screen transitions |
| **@react-native-async-storage/async-storage** | Local data storage for tasks, streaks, etc. |
| **react-native-uuid** | Generating unique task IDs |
| **react-native-gesture-handler** | Enabling swipeable components and gesture control |
| **react-native-reanimated** (implicitly used) | Animations and transitions |
| **react-native-modal** (used via `Modal`) | For task priority/type modals |
| **react-native-animated** | Fade & slide animation for task addition and focus sessions |
| **Custom Hooks** |
| - `useSocialMediaTracker` | Tracks daily social media usage and warns user |
| - `useRewardsSystem` | Handles point rewards and reward modals |
| - `useSentimentAnalyzer` | Analyzes user mood and gives task suggestions |

> ⚠️ Note: Make sure the following custom files are implemented and correctly exported:
> - `./FocusMode.tsx`
> - `./FriendsComparisonScreen.tsx`
> - `./SocialMediaTracker.ts`
> - `./RewardSyatem.ts`
> - `./SentimentalAnalyzer.ts`

---

## 📂 Project Structure

```bash
LifeSucksApp/
├── App.tsx
├── FocusMode.tsx
├── FriendsComparisonScreen.tsx
├── SocialMediaTracker.ts
├── RewardSyatem.ts
├── SentimentalAnalyzer.ts
└── ...

Installation & Setup

Clone the Repository
git clone https://github.com/yourusername/lifesucks-app.git
cd lifesucks-app
Install Dependencies
npm install
Run on Android/iOS
npx expo start




🧪 Future Enhancements

Google Cloud Natural Language API for advanced sentiment analysis
Firebase for cross-device sync and authentication
Push Notifications for task reminders
Analytics dashboard for productivity insights




Let me know if you'd like me to include:
- Screenshot placeholders
- Contribution or usage instructions
- Custom branding for your hackathon entry (e.g., logo, tagline)

Want this saved to a file so you can copy/download it directly?
