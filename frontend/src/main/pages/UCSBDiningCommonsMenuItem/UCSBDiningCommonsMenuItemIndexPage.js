import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function UCSBDiningCommonsMenuItemPage() {

  const currentUser = useCurrentUser();

  const { data: ucsbDiningCommonsMenuItems, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/ucsbdiningcommonsmenuitem/all"],
      { method: "GET", url: "/api/ucsbdiningcommonsmenuitem/all" },
      []
    );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/ucsbdiningcommonsmenuitem/create"
                style={{ float: "right" }}
            >
                Create UCSBDiningCommonsMenuItem 
            </Button>
        )
    } 
  }
  

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBDiningCommonsMenuItem</h1>
        <UCSBDiningCommonsMenuItemTable ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItems} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}