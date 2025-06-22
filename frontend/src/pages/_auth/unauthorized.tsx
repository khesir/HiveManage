import {Button} from '@/components/ui/button';
import {useLocation, useNavigate} from 'react-router-dom';

export default function Unauthorized() {
	const navigate = useNavigate();
	const location = useLocation();
	console.log(location.pathname);
	return (
		<div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
			{/* <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
				404
			</span> */}
			<h2 className="font-heading my-2 text-2xl font-bold">Unauthorized</h2>
			<p>
				Sorry, the page you are looking for doesn&apos;t exist or has been
				moved.
			</p>
			<div className="mt-8 flex justify-center gap-2">
				<Button onClick={() => navigate(-1)} variant="default" size="lg">
					Go back
				</Button>
				<Button
					onClick={() => navigate('/dashboard')}
					variant="ghost"
					size="lg"
				>
					Back to Home
				</Button>
			</div>
		</div>
	);
}
