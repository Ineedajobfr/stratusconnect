# Demo Bots Event Recorder

Edge Function for recording demo bot events in Supabase.

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

## Local Development

```bash
deno task start
```

## Deployment

Deploy to Supabase Edge Functions:

```bash
supabase functions deploy events-recorder
```

## Usage

POST events to the function:

```json
{
  "actor_role": "broker",
  "action": "start_session",
  "payload": {"test": "data"},
  "client_tz": "Europe/London"
}
```

## Security

- Only accepts POST requests
- Uses service role key for database access
- No public read access to demo_events table
