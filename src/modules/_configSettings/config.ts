// Object Oriented Configuration approach to add logics when setting values such as:
// - Validation for specific api keys
// - Base url changes
// - etc.. (More complex global setting)

class ConfigManager {
	private static instance: ConfigManager;
	private baseURL: string;
	private joborder_fee: number;
	constructor() {
		this.baseURL = 'http://localhost:5000';
		this.joborder_fee = 100;
	}

	public static getInstance(): ConfigManager {
		if (!ConfigManager.instance) {
			ConfigManager.instance = new ConfigManager();
		}
		return ConfigManager.instance;
	}

	// Getter for the base URL
	getBaseURL(): string {
		return this.baseURL;
	}

	// Method to update base URL if needed
	setBaseURL(url: string): void {
		this.baseURL = url;
	}
	getJoborderFee(): number {
		return this.joborder_fee;
	}
}

// Probably need to make this to a singleton pattern
class JoborderSetting extends ConfigManager {
	private jobOrderSpecificSetting: string;

	private Joborder_status = [
		'Pending',
		'In Progress',
		'Completed',
		'On Hold',
		'Cancelled',
		'Awaiting Approval',
		'Approved',
		'Rejected',
		'Closed',
	];

	constructor() {
		super();
		this.jobOrderSpecificSetting = 'Default Joborder Settings';
	}
	getTitle() {
		return this.jobOrderSpecificSetting;
	}
	getJoborderStatus() {
		return this.Joborder_status;
	}
}

class TicketsSettings extends ConfigManager {
	private ticketSettingsTitle: string;
	private remarkTicketsStatus: string[] = [
		'Resolved',
		'Pending',
		'In Progress',
		'Rejected',
		'Closed',
		'Open',
	];

	constructor() {
		super();
		this.ticketSettingsTitle = 'Default Ticket Settings';
	}

	getTicketTitleSettings(): string {
		return this.ticketSettingsTitle;
	}

	getRemarkTicketStatus(): string[] {
		return this.remarkTicketsStatus;
	}
}

export default ConfigManager.getInstance();
export {JoborderSetting, TicketsSettings};
