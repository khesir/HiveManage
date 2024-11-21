import {create} from 'zustand';

type PropsProps = {
	track: number;
	setTrack: (newtrack: number) => void;
	resetTrack: () => void;
};

const useTrackReferesh = create<PropsProps>((set) => ({
	track: 0,
	setTrack: (newtrack: number) =>
		set(() => ({
			track: newtrack,
		})),
	resetTrack: () =>
		set(() => ({
			track: 0,
		})),
}));

export default useTrackReferesh;
