import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/theme';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, User, Mail } from 'lucide-react-native';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Not authenticated</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: user.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300' 
            }}
            style={styles.avatar}
          />
        </View>
        
        <Text style={styles.name}>{user.name || 'User'}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <User size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{user.username}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Settings size={20} color={COLORS.text} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Account Settings</Text>
            <Text style={styles.settingDescription}>Privacy and security</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={COLORS.text} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>Configure your alerts</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <HelpCircle size={20} color={COLORS.text} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingDescription}>FAQs and contact</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Button
        title="Logout"
        variant="outline"
        style={styles.logoutButton}
        leftIcon={<LogOut size={20} color={COLORS.error} />}
        textStyle={styles.logoutText}
        onPress={handleLogout}
      />
    </View>
  );
};

// Import additional icons
import { Bell, CircleHelp as HelpCircle } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.xl,
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: SIZES.xl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.xl,
    alignItems: 'center',
    ...SHADOWS.small,
    marginBottom: SIZES.xl,
  },
  avatarContainer: {
    marginBottom: SIZES.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SIZES.md,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary + '40', // 40% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
  settingDescription: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default UserProfile;