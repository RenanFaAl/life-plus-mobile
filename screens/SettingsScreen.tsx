import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  Pressable
} from 'react-native';

import Checkbox from 'expo-checkbox';

import {
  UserPen,
  Mail,
  Lock,
  Accessibility,
  Trash2,
  LogOut,
  X
} from 'lucide-react-native';

import colors from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { deleteAccount, loading } = useUser();

  const navigation = useNavigation<any>();

  const [deleteModalVisible, setDeleteModalVisible] =
    useState(false);

  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Erro ao sair:', error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();

      setDeleteModalVisible(false);

      Alert.alert(
        'Conta excluída',
        'Sua conta foi excluída com sucesso.',
        [
          {
            text: 'OK'
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível excluir sua conta.'
      );
    }
  };

  const settings = [
    {
      icon: UserPen,
      title: 'Editar Perfil',
      desc: 'Atualize suas informações pessoais',
      action: 'Editar',
      onPress: () =>
        navigation.navigate('EditProfile'),
      destructive: false
    },

    {
      icon: Mail,
      title: 'Alterar E-mail',
      desc: 'Mude o e-mail da sua conta',
      action: 'Alterar',
      onPress: () =>
        navigation.navigate('ChangeEmail'),
      destructive: false
    },

    {
      icon: Lock,
      title: 'Alterar Senha',
      desc: 'Atualize sua senha de acesso',
      action: 'Alterar',
      onPress: () =>
        navigation.navigate('ChangePassword'),
      destructive: false
    },

    {
      icon: Accessibility,
      title: 'Acessibilidade',
      desc: 'Configure opções de acessibilidade',
      action: 'Configurar',
      destructive: false
    },

    {
      icon: LogOut,
      title: 'Sair',
      desc: 'Desconectar da sua conta',
      action: 'Sair',
      destructive: false,
      isLogout: true
    },

    {
      icon: Trash2,
      title: 'Excluir Conta',
      desc: 'Exclui permanentemente sua conta',
      action: 'Excluir',
      destructive: true,
      isDelete: true
    }
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Configurações
          </Text>

          <View style={styles.list}>
            {settings.map((s, i) => {
              const Icon = s.icon;

              return (
                <View key={i} style={styles.item}>
                  <View
                    style={[
                      styles.iconBox,
                      s.destructive &&
                        styles.iconBoxDestructive
                    ]}
                  >
                    <Icon
                      size={20}
                      color={
                        s.destructive
                          ? colors.destructive
                          : colors.accent
                      }
                    />
                  </View>

                  <View style={styles.itemText}>
                    <Text style={styles.itemTitle}>
                      {s.title}
                    </Text>

                    <Text style={styles.itemDesc}>
                      {s.desc}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      s.destructive &&
                        styles.actionBtnDestructive
                    ]}
                    onPress={
                      s.isLogout
                        ? handleLogout
                        : s.isDelete
                        ? () =>
                            setDeleteModalVisible(
                              true
                            )
                        : s.onPress
                    }
                  >
                    <Text
                      style={[
                        styles.actionText,
                        s.destructive &&
                          styles.actionTextDestructive
                      ]}
                    >
                      {s.action}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setDeleteModalVisible(false);
                setConfirmDelete(false);
              }}
            >
              <X
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            <View style={styles.deleteIconContainer}>
              <Trash2
                size={32}
                color={colors.destructive}
              />
            </View>

            <Text style={styles.modalTitle}>
              Excluir Conta
            </Text>

            <Text style={styles.modalText}>
              Esta é uma operação irreversível.
              Todos os seus dados serão apagados
              permanentemente.
            </Text>

            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setConfirmDelete(!confirmDelete)}
            >
              <Checkbox
                value={confirmDelete}
                onValueChange={setConfirmDelete}
                color={
                  confirmDelete
                    ? colors.destructive
                    : undefined
                }
              />

              <Text style={styles.checkboxText}>
                Eu entendo que minha conta será
                apagada permanentemente.
              </Text>
            </Pressable>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                (!confirmDelete || loading) && {
                  opacity: 0.5
                }
              ]}
              disabled={
                !confirmDelete || loading
              }
              onPress={handleDeleteAccount}
            >
              {loading ? (
                <ActivityIndicator
                  color={colors.white}
                />
              ) : (
                <Text style={styles.deleteButtonText}>
                  Excluir Conta
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setDeleteModalVisible(false);
                setConfirmDelete(false);
              }}
            >
              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20
  },
  list: {
    gap: 12
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: `${colors.accent}18`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBoxDestructive: {
    backgroundColor: `${colors.destructive}12`
  },
  itemText: {
    flex: 1
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text
  },
  itemDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10
  },
  actionBtnDestructive: {
    borderColor: `${colors.destructive}40`,
    backgroundColor: `${colors.destructive}08`
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text
  },
  actionTextDestructive: {
    color: colors.destructive
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10
  },
  deleteIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.destructive}15`,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12
  },
  modalText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20
  },
  deleteButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  deleteButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15
  },
  cancelButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15
  }
});