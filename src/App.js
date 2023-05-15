import AuthorizationForm from './components/AuthorizationForm';
import './App.css';

const App = () => {
	return (
		<section>
			<div className="d-flex justify-content-start">
				<header>Green Api</header>
			</div>
			<AuthorizationForm />
		</section>
	)
}

export default App;
