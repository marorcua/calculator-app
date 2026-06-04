# Calculator App

A robust, modern investment and loan calculator application built with React Native (Expo) and NativeWind (Tailwind CSS).

## Features

- **Investment Calculator**: Calculate future value of investments with compound interest.
- **Loan Calculator**: Calculate monthly payments for loans.
- **Dynamic FIRE Planning**: Includes "FIRE income" (Financial Independence, Retire Early) projections based on customizable withdrawal and tax rates.
- **Fluid UI**: Features custom-built, animated "Number Roulette" components for intuitive input selection.
- **Persistence**: Automatically saves and loads your calculation data using `AsyncStorage`.
- **Responsive Design**: Optimized for both mobile and web platforms.

## Setup

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd calculator-app
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment**: Ensure you have Expo Go installed on your mobile device for local development.

## How to Run

- **Development**:
  ```bash
  npm start
  ```
- **iOS**:
  ```bash
  npm run ios
  ```
- **Android**:
  ```bash
  npm run android
  ```
- **Web**:
  ```bash
  npm run web
  ```

## How to Test

This project uses **Jest** for unit testing.

- **Run tests**:
  ```bash
  npm test
  ```
- **Watch mode**:
  ```bash
  npm run test:watch
  ```
- **Coverage report**:
  ```bash
  npm run test:coverage
  ```

## CI/CD Pipeline

The project includes a robust CI/CD setup:

- **Git Hooks (Husky)**:
  - `pre-commit`: Runs `lint-staged` to automatically lint and format staged files.
  - `pre-push`: Runs type checking (`tsc`) and the full test suite (`jest`) before allowing a push to the remote.
- **GitHub Actions (CI)**:
  - Runs linting, type-checking, and tests on every pull request and push to the `main` branch.
- **Continuous Deployment (CD)**:
  - Configured for **Expo Application Services (EAS)** with profiles for development, preview, and production builds.
