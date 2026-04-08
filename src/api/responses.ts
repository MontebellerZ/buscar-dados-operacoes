export interface ResponseBuscarListaIssues {
  xsrfToken: string;
  allReqFilter: {
    selectedPage: number;
    resultsPerPage: number;
    totalResults: number;
    totalPages: number;
    sortOrder: string;
    sortBy: string;
    nextToken: string;
    portalRequestTypes: any[];
    requestList: {
      key: string;
      iconUrl: string;
      requestTypeName: string;
      summary: string;
      portalBaseUrl: string;
      portalName: string;
      categoryKey: string;
      status: string;
      reporterDisplayName: string;
    }[];
  };
}

export type ResponseBuscarIssueId = {
  xsrfToken: string;
  reqDetails: {
    reporter: {
      email: string;
      displayName: string;
      avatarUrl: string;
      accountId: string;
    };
    participants: Array<any>;
    organisations: Array<any>;
    requestTypeName: string;
    key: string;
    projectId: string;
    issueType: string;
    issueTypeName: string;
    issue: {
      id: number;
      key: string;
      reporter: {
        email: string;
        displayName: string;
        avatarUrl: string;
        accountId: string;
      };
      assignee: {
        displayName: string;
        avatarUrl: string;
        accountId: string;
      };
      participants: Array<any>;
      organisations: Array<any>;
      sequence: number;
      serviceDeskKey: string;
      requestTypeName: string;
      requestTypeId: number;
      summary: string;
      isNew: boolean;
      status: string;
      resolution: string;
      date: string;
      friendlyDate: string;
      fields: Array<any>;
      activityStream: Array<{
        type: string;
        activityText: string;
        date: string;
        friendlyDate: string;
        status?: string;
        author?: string;
        avatarUrl?: string;
        commentId?: number;
        comment?: string;
        rawComment?: string;
        adfComment?: string;
        invisibleToReporter?: boolean;
        outsiderComment?: boolean;
        canAddAuthorAsParticipant?: boolean;
        resolution?: string;
      }>;
      requestIcon: number;
      iconUrl: string;
      canBrowse: boolean;
      canAttach: boolean;
      canExport: boolean;
      categoryKey: string;
      creatorAccountId: string;
      formKey: string;
    };
    canCreateAttachments: boolean;
    canCreateIssues: boolean;
    canAddComment: boolean;
    canViewIssueInJIRA: boolean;
    canAddParticipants: boolean;
    canRemoveParticipants: boolean;
    canSearchParticipants: boolean;
    canSignupParticipants: boolean;
    canSubmitWithEmailAddress: boolean;
    canShareRequest: boolean;
    topPanels: Array<any>;
    detailsPanels: Array<any>;
    optionPanels: Array<any>;
    actionSections: Array<{
      params: {
        styleClass: string;
      };
      key: string;
      label: string;
      items: Array<any>;
    }>;
    issueLinkUrl: string;
    requestDetailsBaseUrl: string;
    customerInvited: boolean;
    subscribeAction: string;
    approvalStatus: Array<any>;
    workflowTransitions: Array<any>;
    readFileMediaCredentials: {
      clientId: string;
      endpointUrl: string;
      tokenLifespanInSeconds: number;
      tokensWithFiles: Array<{
        token: string;
        files: Array<{
          attachmentId: number;
          attachmentMediaApiId: string;
          issueId: number;
        }>;
      }>;
    };
    hasProformaForm: boolean;
    isProformaHarmonisationEnabled: boolean;
  };
};

export type ResponseBuscarDadosExpandidos = {
  customfield_11577: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      choices: Array<{
        id: string;
        label: string;
      }>;
    };
    name: string;
  };
  customfield_12197: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      choices: Array<{
        id: string;
        label: string;
      }>;
    };
    name: string;
  };
  customfield_10107: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_11678: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_12186: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_12209: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_11769: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_11773: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_11590: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      text: string;
    };
    name: string;
  };
  customfield_12222: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      adf: {
        type: string;
        version: number;
        content: Array<{
          type: string;
          content: Array<{
            type: string;
            text?: string;
          }>;
        }>;
      };
    };
    name: string;
  };
  customfield_11736: {
    fieldConfigId: string;
    schema: {
      custom: string;
      type: string;
    };
    value: {
      choices: Array<{
        id: string;
        label: string;
      }>;
    };
    name: string;
  };
};
