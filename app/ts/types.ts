import type { Granularity } from './enums';
export interface FacebookBusiness {
	business_id: string,
	business_name: string
};

export interface AccountConnection {
	id: string,
	name: string,
};

export interface Store {
	id: string,
	name: string,
	google_client: AccountConnection,
	facebook_business: FacebookBusiness
	[key: string]: any;
};

export interface StoreIntervalQuery {
	store: string,
	start: string,
	end: string,
	granularity?: Granularity
}

export interface StoreData {
	store: string,
	access_token: string,
	storefront_token: string
	request: Request
}