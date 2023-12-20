export interface IWhoAmI {
    id: string
    active: boolean
    expires_at: string
    authenticated_at: string
    authenticator_assurance_level: string
    authentication_methods: IAuthenticationMethod[]
    issued_at: string
    identity: IIdentity
    devices: IDevice[]
}

export interface IAuthenticationMethod {
    method: string
    aal: string
    completed_at: string
}

export interface IIdentity {
    id: string
    schema_id: string
    schema_url: string
    state: string
    state_changed_at: string
    traits: ITraits
    verifiable_addresses: IVerifiableAddress[]
    recovery_addresses: IRecoveryAddress[]
    metadata_public: unknown
    created_at: string
    updated_at: string
}

export interface ITraits {
    email: string
    username: IUsername
}

export interface IUsername {
    username: string
}

export interface IVerifiableAddress {
    id: string
    value: string
    verified: boolean
    via: string
    status: string
    verified_at: string
    created_at: string
    updated_at: string
}

export interface IRecoveryAddress {
    id: string
    value: string
    via: string
    created_at: string
    updated_at: string
}

export interface IDevice {
    id: string
    ip_address: string
    user_agent: string
    location: string
}
