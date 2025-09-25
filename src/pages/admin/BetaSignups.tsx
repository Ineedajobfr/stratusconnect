import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Search, Users, Mail, Phone, Calendar } from 'lucide-react'
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

type Row = {
  id: string
  created_at: string
  full_name: string | null
  email: string
  phone: string | null
  source: string | null
  status: string
  notion_sync_status: string | null
}

export default function BetaSignups() {
  const [rows, setRows] = useState<Row[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('beta_signups')
        .select('id,created_at,full_name,email,phone,source,status,notion_sync_status')
        .order('created_at', { ascending: false })
      if (!error && data) setRows(data as Row[])
      setLoading(false)
    })()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return rows
    return rows.filter(r =>
      (r.full_name || '').toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      (r.phone || '').toLowerCase().includes(s) ||
      (r.source || '').toLowerCase().includes(s)
    )
  }, [rows, q])

  function exportCsv() {
    const header = ['id','created_at','full_name','email','phone','source','status','notion_sync_status']
    const lines = [header.join(',')]
    filtered.forEach(r => {
      lines.push([r.id, r.created_at, r.full_name || '', r.email, r.phone || '', r.source || '', r.status, r.notion_sync_status || ''].map(v =>
        `"${String(v).replace(/"/g,'""')}"`
      ).join(','))
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'beta_signups.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getNotionBadge = (status: string | null) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Synced</Badge>
      case 'fail':
        return <Badge variant="destructive">Failed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">N/A</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Beta Signups</h1>
          <p className="text-muted-foreground">Manage and export beta signup data</p>
        </div>

        <Card className="terminal-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-accent" />
                <CardTitle className="text-foreground">
                  {filtered.length} signup{filtered.length !== 1 ? 's' : ''}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search name, email, phone, source"
                    className="pl-10 w-80"
                  />
                </div>
                <Button onClick={exportCsv} className="bg-accent hover:bg-accent/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {q ? 'No signups match your search' : 'No beta signups yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-terminal-border">
                      <th className="p-3 text-muted-foreground font-medium">Created</th>
                      <th className="p-3 text-muted-foreground font-medium">Name</th>
                      <th className="p-3 text-muted-foreground font-medium">Email</th>
                      <th className="p-3 text-muted-foreground font-medium">Phone</th>
                      <th className="p-3 text-muted-foreground font-medium">Source</th>
                      <th className="p-3 text-muted-foreground font-medium">Status</th>
                      <th className="p-3 text-muted-foreground font-medium">Notion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id} className="border-b border-terminal-border hover:bg-terminal-card/50 transition-colors">
                        <td className="p-3 text-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(r.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-3 text-foreground font-medium">
                          {r.full_name || '-'}
                        </td>
                        <td className="p-3 text-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {r.email}
                          </div>
                        </td>
                        <td className="p-3 text-foreground">
                          {r.phone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {r.phone}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="p-3 text-foreground">
                          {r.source || '-'}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(r.status)}
                        </td>
                        <td className="p-3">
                          {getNotionBadge(r.notion_sync_status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
