import { RequireLogin } from './components/require-login'

function App() {
  return (
    <RequireLogin>
      <div>
        hello world
      </div>
    </RequireLogin>
  )
}

export default App
