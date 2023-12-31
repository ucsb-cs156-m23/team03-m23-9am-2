import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/recommendationRequestUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
///////////////////done
export default function RecommendationRequestTable({
    recommendationRequests,
    currentUser,
    testIdPrefix = "RecommendationRequestTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/RecommendationRequest/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/RecommendationRequest/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }
////////////////////done
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'RequesterEmail',
            accessor: 'requesterEmail',
        },
        {
            Header: 'ProfessorEmail',
            accessor: 'professorEmail',
        },
        {
            Header: 'Explanation',
            accessor: 'explanation',
        },
        {
            Header: 'DateRequested',
            accessor: 'dateRequested',
        },
        {
            Header: 'DateNeeded',
            accessor: 'dateNeeded',
        },
        {
            Header: 'Done',
            accessor: (row, _rowIndex) => String(row.done),
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={recommendationRequests}
        columns={columns}
        testid={testIdPrefix}
    />;
};

