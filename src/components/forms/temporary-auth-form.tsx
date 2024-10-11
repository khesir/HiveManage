'use client';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function TemporaryUserAuthForm() {
	const [loading] = useState(false);
	const navigate = useNavigate();

	const onSubmit = async (data: string) => {
		if (data === 'Admin') {
			navigate('admin/dashboard');
		} else if (data === 'Tech') {
			navigate('tech/dashboard');
		} else {
			navigate('sales/dashboard');
		}
	};

	return (
		<>
			<div className="w-full space-y-2">
				<Button
					disabled={loading}
					className="ml-auto w-full"
					onClick={() => {
						onSubmit('Admin');
					}}
				>
					Continue as Admin
				</Button>
				<Button
					disabled={loading}
					className="ml-auto w-full"
					onClick={() => {
						onSubmit('Tech');
					}}
				>
					Continue as Technician
				</Button>
				<Button
					disabled={loading}
					className="ml-auto w-full"
					onClick={() => {
						onSubmit('Sales');
					}}
				>
					Continue as Sales
				</Button>
			</div>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
		</>
	);
}
