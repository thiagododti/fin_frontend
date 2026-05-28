import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { paths } from '@/routes/paths';

export function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <p className="text-6xl font-bold text-destructive">403</p>
                    <CardTitle>Acesso Proibido</CardTitle>
                    <CardDescription>
                        Você não tem permissão para acessar este recurso.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => navigate(paths.home)}>
                        Voltar para a página inicial
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
