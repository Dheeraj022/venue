import { supabase } from './supabaseClient';

export const generatePasskey = async () => {
    const passkey = Array.from({ length: 5 }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    try {
        // 1. Deactivate old keys
        const { error: updateError } = await supabase
            .from('admin_passkeys')
            .update({ is_active: false })
            .eq('is_active', true);

        if (updateError) {
            console.error('Error deactivating old passkeys:', updateError);
            // We continue anyway as inserting a new one is more important
        }

        // 2. Insert new key
        const { data, error: insertError } = await supabase
            .from('admin_passkeys')
            .insert([{
                passkey,
                expires_at: expiresAt,
                is_active: true,
                attempts: 0
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting new passkey:', insertError);
            throw insertError;
        }

        return data;
    } catch (err) {
        console.error('Passkey generation failed:', err);
        throw err;
    }
};

export const verifyPasskey = async (inputPasskey) => {
    if (!inputPasskey) return { success: false, message: 'Please enter a passkey' };

    const formattedKey = inputPasskey.trim().toUpperCase();

    try {
        const { data, error: fetchError } = await supabase
            .from('admin_passkeys')
            .select('*')
            .eq('passkey', formattedKey)
            .eq('is_active', true)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle(); // Better than .single() as it doesn't error on 0 results

        if (fetchError) {
            console.error('Database error during verification:', fetchError);
            return { success: false, message: 'Verification service error' };
        }

        if (!data) {
            console.warn(`No active/valid passkey found for: ${formattedKey}`);
            return { success: false, message: 'Invalid or Expired Passkey' };
        }

        if (data.attempts >= 5) {
            console.warn(`Too many attempts for key: ${formattedKey}`);
            return { success: false, message: 'Too many attempts. Generate a new passkey from Admin Panel.' };
        }

        // Double check comparison (redundant but safe)
        if (data.passkey === formattedKey) {
            return { success: true, data };
        } else {
            // This should technically not happen with the .eq() query above
            // Increment attempts
            await supabase
                .from('admin_passkeys')
                .update({ attempts: (data.attempts || 0) + 1 })
                .eq('id', data.id);

            return { success: false, message: 'Invalid or Expired Passkey' };
        }
    } catch (err) {
        console.error('Critical error in verifyPasskey:', err);
        throw err;
    }
};
