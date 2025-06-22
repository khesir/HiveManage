/* eslint-disable @typescript-eslint/no-explicit-any */
import {ProcessData} from '@/components/hooks/use-progress-store';

export const CreateServiceProcess = async (
	setProgress: (progress: ProcessData) => void,
	salesHookData: any,
): Promise<void> => {
	// Process Visuals
	// This is the variable to access all data to need for saving
	// Wla ni type safety so proceed by looking manually sa Dev tools
	// To open use CTRL + SHIFT + I
	// step 1  create custoer
	// step 2 create sales
	// step 3 create service
	// step 4 create related services
	console.log(salesHookData);
	// Code below simulates data request in the backend
	setProgress({message: 'Starting...', value: 0});
	await sleep(300);
	console.log('pass 1');
	setProgress({message: 'Processing 1', value: 20});
	await sleep(300);
	console.log('pass 2');
	setProgress({message: 'Processing 2', value: 40});
	await sleep(300);
	console.log('pass 3');
	setProgress({message: 'Processing 3', value: 60});
	await sleep(300);
	console.log('pass 4');
	setProgress({message: 'Processing 4', value: 80});
	await sleep(300);
	console.log('pass 5');
	setProgress({message: 'Completed!', value: 100});
};

function sleep(ms: number | undefined) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
