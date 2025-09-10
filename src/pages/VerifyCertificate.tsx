import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Shield, FileText, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";

type VerifyResp = {
  id: string;
  valid: boolean;
  reason: { 
    digest: boolean; 
    signature: boolean; 
    chain: boolean;
    status: string; 
    expired: boolean;
    sigCount: number;
  };
  public: { 
    cert_type: string; 
    subject_name: string; 
    issued_at: string; 
    expires_at: string | null; 
    key_id: string;
    anchor_root?: string;
  };
};

export default function VerifyCertificate() {
  const [data, setData] = useState<VerifyResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      setError("Missing certificate ID");
      setLoading(false);
      return;
    }

    fetch(`/api/cert/verify?id=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <div>Verifying certificate...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || "Certificate not found"}
            </p>
            <Button onClick={() => window.location.href = '/'} className="w-full mt-4">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Certificate Verification</h1>
          <p className="text-gunmetal">Defense-grade PKI verification system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Verification Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {data.valid ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Verification Status
              </CardTitle>
              <CardDescription>
                {data.valid ? "Certificate is valid and authentic" : "Certificate verification failed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${data.valid ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                <div className="text-lg font-semibold">
                  {data.valid ? "✓ VALID CERTIFICATE" : "✗ INVALID CERTIFICATE"}
                </div>
                <div className="text-sm opacity-70">
                  {data.valid ? "All security checks passed" : "One or more security checks failed"}
                </div>
              </div>

              {/* Security Checks */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Security Checks:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {data.reason.digest ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Digest verification: {data.reason.digest ? "PASS" : "FAIL"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.reason.signature ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Threshold signatures ({data.reason.sigCount}/2): {data.reason.signature ? "PASS" : "FAIL"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.reason.chain ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Ledger chain integrity: {data.reason.chain ? "PASS" : "FAIL"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.reason.status === "active" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Certificate status: {data.reason.status.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!data.reason.expired ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span>Expiration: {data.reason.expired ? "EXPIRED" : "VALID"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Details */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Certificate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gunmetal">Certificate ID</div>
                  <div className="font-mono text-sm text-white break-all">{data.id}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gunmetal">Type</div>
                  <Badge variant="outline" className="text-accent border-accent">
                    {data.public.cert_type}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm text-gunmetal">Holder</div>
                  <div className="text-white font-semibold">{data.public.subject_name}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gunmetal">Issued</div>
                  <div className="text-white flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(data.public.issued_at).toUTCString()}
                  </div>
                </div>
                
                {data.public.expires_at && (
                  <div>
                    <div className="text-sm text-gunmetal">Expires</div>
                    <div className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(data.public.expires_at).toUTCString()}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm text-gunmetal">Key Version</div>
                  <div className="text-white font-mono text-sm">{data.public.key_id}</div>
                </div>

                {data.public.anchor_root && (
                  <div>
                    <div className="text-sm text-gunmetal">Transparency Anchor</div>
                    <div className="text-white font-mono text-xs break-all">{data.public.anchor_root}</div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-sm text-gunmetal">
                  <Shield className="h-4 w-4" />
                  <span>Verified by Stratus Connect PKI</span>
                </div>
                <div className="text-xs text-gunmetal mt-1">
                  This certificate is cryptographically signed and verified using Ed25519 signatures and SHA-256 digests.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
