import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from 'main/components/RecommendationRequests/RecommendationRequestForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: RecommendationRequest, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/RecommendationRequest?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/RecommendationRequest`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (RecommendationRequest) => ({
        url: "/api/RecommendationRequest",
        method: "PUT",
        params: {
            id: RecommendationRequest.id,
        },
        data: {
            requesterEmail: RecommendationRequest.requesterEmail,
            professorEmail: RecommendationRequest.professorEmail,
            explanation: RecommendationRequest.explanation,
            dateRequested: RecommendationRequest.dateRequested,
            dateNeeded: RecommendationRequest.dateNeeded,
            done: RecommendationRequest.done
        }
    });

    const onSuccess = (RecommendationRequest) => {
        toast(`RecommendationRequest Updated - id: ${RecommendationRequest.id} Requester: ${RecommendationRequest.requesterEmail}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/RecommendationRequest?id=${id}`]
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
                <h1>Edit RecommendationRequest</h1>
                {
                    RecommendationRequest && <RecommendationRequestForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={RecommendationRequest} />
                }
            </div>
        </BasicLayout>
    )

}