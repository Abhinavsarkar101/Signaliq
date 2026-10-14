import React from 'react';
import { SurveyDistributionModal } from './SurveyDistributionModal';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId?: string;
  projectId?: string;
  surveyUrl: string;
  surveyTitle: string;
  onCampaignSent?: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  surveyId = '',
  projectId = '',
  surveyUrl,
  surveyTitle,
  onCampaignSent,
}) => {
  return (
    <SurveyDistributionModal
      isOpen={isOpen}
      onClose={onClose}
      surveyId={surveyId}
      projectId={projectId}
      surveyTitle={surveyTitle}
      surveyUrl={surveyUrl}
      onCampaignSent={onCampaignSent}
    />
  );
};
