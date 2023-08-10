import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function RecommendationRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "RecommendationRequestForm";//done in 8/8/2023

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">requesterEmail</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-requesterEmail"}
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", {
                        required: "requesterEmail is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="professorEmail">professorEmail</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-professorEmail"}
                    id="professorEmail"
                    type="text"
                    isInvalid={Boolean(errors.professorEmail)}
                    {...register("professorEmail", {
                        required: "professorEmail is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.professorEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">explanation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateRequested">dateRequested</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dateRequested"}
                    id="dateRequested"
                    type="text"
                    isInvalid={Boolean(errors.dateRequested)}
                    {...register("dateRequested", {
                        required: "dateRequested is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateRequested?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateNeeded">dateNeeded</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dateNeeded"}
                    id="dateNeeded"
                    type="text"
                    isInvalid={Boolean(errors.dateNeeded)}
                    {...register("dateNeeded", {
                        required: "dateNeeded is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateNeeded?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="done">done</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-done"}
                    id="done"
                    type="text"
                    isInvalid={Boolean(errors.done)}
                    {...register("done", {
                        required: "done is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.done?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RecommendationRequestForm;