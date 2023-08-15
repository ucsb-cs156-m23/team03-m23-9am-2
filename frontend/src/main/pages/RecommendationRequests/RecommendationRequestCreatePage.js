import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (RecommendationRequest) => ({
    url: "/api/RecommendationRequest/post",
    method: "POST",
    params: {
      requesterEmail: RecommendationRequest.requesterEmail,
      professorEmail: RecommendationRequest.professorEmail,
      explanation: RecommendationRequest.explanation,
      dateRequested: RecommendationRequest.dateRequested,
      dateNeeded: RecommendationRequest.dateNeeded,
      done: RecommendationRequest.done
    }
  });

  const onSuccess = (RecommendationRequest) => {
    toast(`New RecommendationRequest Created - id: ${RecommendationRequest.id} requester: ${RecommendationRequest.requesterEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/RecommendationRequest/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/RecommendationRequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New RecommendationRequest</h1>
        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
