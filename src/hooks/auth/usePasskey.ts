import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { fetchApi } from '@/lib/api/api-client';
import { useState } from 'react';

export const usePasskey = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registerPasskey = async (name: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Get options from BE
            const options = await fetchApi('/auth/webauthn/register/start', {
                method: 'POST',
            }) as PublicKeyCredentialCreationOptionsJSON;

            // 2. Browser interaction
            const attResp = await startRegistration({ optionsJSON: options });

            // 3. Verify with BE
            await fetchApi('/auth/webauthn/register/finish', {
                method: 'POST',
                body: JSON.stringify({
                    credentialId: attResp.id,
                    response: JSON.stringify(attResp.response),
                    clientDataJSON: attResp.response.clientDataJSON, // Required? simplewebauthn handles structure
                    credentialName: name
                }),
            });

            return true;
        } catch (err: any) {
            console.error('Passkey registration failed', err);
            setError(err.message || 'Passkey registration failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithPasskey = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Get options
            const options = await fetchApi('/auth/webauthn/login/start', { method: 'POST' }) as PublicKeyCredentialRequestOptionsJSON;

            // 2. Browser interaction
            const authResp = await startAuthentication({ optionsJSON: options });

            // 3. Verify
            await fetchApi('/auth/webauthn/login/finish', {
                method: 'POST',
                body: JSON.stringify(authResp),
            });

            return true;
        } catch (err: any) {
            console.error('Passkey login failed', err);
            setError(err.message || 'Passkey login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { registerPasskey, loginWithPasskey, isLoading, error };
};
