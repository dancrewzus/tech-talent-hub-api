export const app = {
  assistants: {
    TESTING_ASSISTANT: true,
    MAIN_ASSISTANT_NAME: 'rentmies',
    CONVERSATIONAL_ASSISTANT_NAME: 'rentmies_chat',
  },
  execution: {
    COMPLETION_CHECK_TIME: 1500,
    status: {
      FAILED: 'failed',
      COMPLETED: 'completed',
      REQUIRES_ACTION: 'requires_action',
      SUBMIT_TOOL_OUTPUTS: 'submit_tool_outputs',
    }
  }
}