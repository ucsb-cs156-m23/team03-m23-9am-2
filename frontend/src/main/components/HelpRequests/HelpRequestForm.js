import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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
// Stryker disable next-line Regex
const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    const testIdPrefix = "HelpRequestForm";

    const validateSolved = (value) => {
    if (!value || value === "" || value === undefined) {
      return "solved is required.";
    }
}

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
                <Form.Label htmlFor="requesterEmail">RequesterEmail</Form.Label>
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
                <Form.Label htmlFor="teamId">TeamId</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-teamId"}
                    id="teamId"
                    type="text"
                    isInvalid={Boolean(errors.teamId)}
                    {...register("teamId", {
                        required: "teamId is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.teamId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="tableOrBreakoutRoom">TableOrBreakoutRoom</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-tableOrBreakoutRoom"}
                    id="tableOrBreakoutRoom"
                    type="text"
                    isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                    {...register("tableOrBreakoutRoom", {
                        required: "tableOrBreakoutRoom is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.tableOrBreakoutRoom?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="requestTime">RequestTime</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-requestTime"}
                        id="requestTime"
                        type="datetime-local"
                        isInvalid={Boolean(errors.requestTime)}
                        {...register("requestTime", {
                            required: "requestTime is required.",
                            pattern: {
                            value: isodate_regex,
                            message: "requestTime must be in ISO format",
                        },
                        })}
                    />
                <Form.Control.Feedback type="invalid">
                    {errors.requestTime?.message}
                </Form.Control.Feedback>
            </Form.Group>




            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "explanation is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3">
        <Form.Label htmlFor="solved">Solved</Form.Label>
        <Form.Control
        data-testid={testIdPrefix + "-solved"}
        id="solved"
          as="select"
          required
          isInvalid={Boolean(errors.solved)}
          {...register("solved", { validate: validateSolved })}
        >
          <option value="">Select an option</option>
          <option value="True">True</option>
          <option value="False">False</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.solved && errors.solved.message}
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

export default HelpRequestForm;