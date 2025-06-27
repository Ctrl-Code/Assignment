import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router"
import { projectRoutes } from "@/utils/project-routes"

export const VerifyEmail = () => {
    const navigate = useNavigate()
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify your email!</CardTitle>
      </CardHeader>
      <CardContent>
        <p>We have sent you an email with a link to verify your email. After verifying your email, you can login to your account.</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full" onClick={() => navigate(projectRoutes.logout)}>
            Go to Login Page
        </Button>
      </CardFooter>
    </Card>
  )
}
