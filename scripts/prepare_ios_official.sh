#!/usr/bin/env bash

sed -i '' \
	's/PRODUCT_BUNDLE_IDENTIFIER = mr.gov.mtnima.govcom.ShareExtension;/PRODUCT_BUNDLE_IDENTIFIER = chat.rocket.ios.Rocket-Chat-ShareExtension;/' \
	../RocketChatRN.xcodeproj/project.pbxproj

sed -i '' \
	's/PRODUCT_BUNDLE_IDENTIFIER = mr.gov.mtnima.govcom.NotificationService;/PRODUCT_BUNDLE_IDENTIFIER = chat.rocket.ios.NotificationService;/' \
	../RocketChatRN.xcodeproj/project.pbxproj