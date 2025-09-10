# Defense-Grade PKI Certificate System Setup

This document outlines the setup and configuration of the bulletproof certificate system for Stratus Connect.

## Environment Variables

Set these on Netlify:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# GitHub Integration (for transparency log)
GITHUB_TOKEN=your_github_token_with_gist_scope
GITHUB_GIST_ID=your_gist_id_for_anchoring

# Certificate Issuer Keys (generate these offline)
ISSUER1_PUBLIC_KEY=base64_ed25519_public_key_1
ISSUER1_PRIVATE_KEY=base64_ed25519_private_key_1
ISSUER1_KEY_ID=v1a

ISSUER2_PUBLIC_KEY=base64_ed25519_public_key_2
ISSUER2_PRIVATE_KEY=base64_ed25519_private_key_2
ISSUER2_KEY_ID=v1b

# PDF Branding
PDF_BRAND_NAME=Stratus Connect
PDF_BRAND_URL=https://stratusconnect.com

# Public Origin (for WebAuthn)
PUBLIC_ORIGIN=https://stratusconnect.com
```

## Key Generation

Generate your Ed25519 key pairs offline (never commit private keys):

```bash
# Generate key pair 1
node -e "const nacl=require('tweetnacl');const kp=nacl.sign.keyPair();console.log('ISSUER1_PUBLIC_KEY:',Buffer.from(kp.publicKey).toString('base64'));console.log('ISSUER1_PRIVATE_KEY:',Buffer.from(kp.secretKey).toString('base64'))"

# Generate key pair 2
node -e "const nacl=require('tweetnacl');const kp=nacl.sign.keyPair();console.log('ISSUER2_PUBLIC_KEY:',Buffer.from(kp.publicKey).toString('base64'));console.log('ISSUER2_PRIVATE_KEY:',Buffer.from(kp.secretKey).toString('base64'))"
```

## Database Setup

1. Run the migration: `supabase/migrations/20250110000001_certificates.sql`
2. Seed the issuer public keys:

```sql
INSERT INTO public.issuer_public_keys(key_id, public_b64, enabled)
VALUES
  ('v1a', 'YOUR_ISSUER1_PUBLIC_KEY', true),
  ('v1b', 'YOUR_ISSUER2_PUBLIC_KEY', true)
ON CONFLICT (key_id) DO UPDATE SET public_b64 = excluded.public_b64, enabled = excluded.enabled;
```

## GitHub Gist Setup

1. Create a new GitHub gist (can be private)
2. Note the gist ID from the URL
3. Set `GITHUB_GIST_ID` environment variable

## Features

### Defense-Grade Security
- **Ed25519 Signatures**: Modern, fast, widely respected cryptographic signatures
- **Threshold Signatures**: Requires 2 of 2 signatures for certificate validity
- **SHA-256 Digests**: Canonical JSON serialization prevents replay attacks
- **Tamper-Evident Ledger**: Chained hashes make tampering immediately detectable
- **Transparency Log**: Daily Merkle roots anchored to GitHub gist for public verification

### Certificate Lifecycle
- **Issue**: Create certificates with dual signatures and PDF generation
- **Verify**: Public verification with QR codes and web interface
- **Revoke**: Secure revocation with approval workflow
- **Audit**: Complete event logging and ledger tracking

### WebAuthn Admin Controls
- **Passkey Authentication**: Hardware-backed admin authentication
- **M of N Approvals**: High-value actions require multiple admin approvals
- **Audit Trail**: All admin actions logged with WebAuthn assertions

## API Endpoints

### Certificate Management
- `POST /api/cert/issue` - Issue new certificate
- `GET /api/cert/verify?id={id}` - Verify certificate
- `POST /api/cert/revoke` - Revoke certificate

### WebAuthn Admin
- `POST /api/webauthn/register-options` - Get registration options
- `POST /api/webauthn/register-verify` - Verify registration
- `POST /api/webauthn/auth-options` - Get authentication options
- `POST /api/webauthn/auth-verify` - Verify authentication
- `POST /api/hv/approve` - Approve high-value transaction

### Scheduled Functions
- `scheduled_anchor` - Daily transparency log anchoring (runs @daily)

## Frontend Pages

- `/verify` - Public certificate verification page
- `/admin/certificates` - Certificate management (admin only)

## Security Model

1. **Offline Root Keys**: Private keys never touch the network
2. **Threshold Signatures**: No single point of failure
3. **Immutable Records**: Certificates cannot be modified, only revoked
4. **Public Verification**: Anyone can verify without trusting Stratus
5. **Transparency**: Daily anchors provide public timestamping
6. **Audit Trail**: Complete ledger of all actions

## Cost

- **Netlify Functions**: Free tier covers moderate usage
- **Supabase**: Pro tier for RLS and real-time features
- **GitHub**: Free for gist anchoring
- **No Licenses**: All open-source components

This system provides bank-grade security at zero ongoing cost, with public verifiability that builds trust in the Stratus Connect platform.
