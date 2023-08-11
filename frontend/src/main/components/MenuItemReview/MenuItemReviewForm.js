import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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

    const testIdPrefix = "MenuItemReviewForm";
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
                <Form.Label htmlFor="itemId">Item Id</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-itemId"}
                    id="itemId"
                    type="text"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("itemId", {
                        required: "Item Id is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.itemId?.message}
                </Form.Control.Feedback>
            </Form.Group>
    
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-reviewerEmail"}
                    id="reviewerEmail"
                    type="email"
                    isInvalid={Boolean(errors.reviewerEmail)}
                    {...register("reviewerEmail", {
                        required: "Reviewer Email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>
    
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="stars">Stars</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-stars"}
                    id="stars"
                    type="number"
                    isInvalid={Boolean(errors.stars)}
                    {...register("stars", {
                        required: "Stars are required.",
                        min: {
                            value: 1,
                            message: "Minimum value is 1"
                        },
                        max: {
                            value: 5,
                            message: "Maximum value is 5"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.stars?.message}
                </Form.Control.Feedback>
            </Form.Group>
    
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="localDateTime">Local Date Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-localDateTime"}
                    id="localDateTime"
                    type="datetime-local"
                    isInvalid={Boolean(errors.localDateTime)}
                    {...register("localDateTime", {
                        required: "Local Date Time is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.localDateTime?.message}
                </Form.Control.Feedback>
            </Form.Group>
    
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">Comments</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-comments"}
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.comments)}
                    {...register("comments")}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comments?.message}
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

export default MenuItemReviewForm;